-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geom column to plots table
ALTER TABLE "public"."plots" ADD COLUMN "geom" geometry(Polygon, 20137);

-- Add constraint to ensure only valid polygons are allowed
ALTER TABLE "public"."plots" ADD CONSTRAINT "plots_geom_valid_check" 
CHECK (geom IS NULL OR ST_IsValid(geom));

-- Create GiST spatial index on geom column for fast spatial queries
CREATE INDEX "plots_geom_gist_idx" ON "public"."plots" USING GIST ("geom");

-- Create function to convert ESRI rings to PostGIS polygon
CREATE OR REPLACE FUNCTION convert_esri_rings_to_polygon(geo_json JSONB)
RETURNS geometry AS $$
DECLARE
    rings JSONB;
    ring JSONB;
    ring_array JSONB;
    polygon_text TEXT;
    result_geom geometry;
BEGIN
    -- Check if geo_json has geometry.rings
    IF geo_json IS NULL OR NOT (geo_json ? 'geometry') OR NOT (geo_json->'geometry' ? 'rings') THEN
        RETURN NULL;
    END IF;
    
    rings := geo_json->'geometry'->'rings';
    
    -- Check if rings is an array and not empty
    IF jsonb_typeof(rings) != 'array' OR jsonb_array_length(rings) = 0 THEN
        RETURN NULL;
    END IF;
    
    -- Get the first ring (outer ring)
    ring := rings->0;
    
    -- Check if ring is an array of coordinate pairs
    IF jsonb_typeof(ring) != 'array' OR jsonb_array_length(ring) < 4 THEN
        RETURN NULL;
    END IF;
    
    -- Convert ring to polygon WKT format
    polygon_text := 'POLYGON((';
    
    -- Add all coordinate pairs
    FOR i IN 0..jsonb_array_length(ring)-1 LOOP
        ring_array := ring->i;
        IF jsonb_typeof(ring_array) = 'array' AND jsonb_array_length(ring_array) = 2 THEN
            IF i > 0 THEN
                polygon_text := polygon_text || ', ';
            END IF;
            polygon_text := polygon_text || (ring_array->0)::text || ' ' || (ring_array->1)::text;
        END IF;
    END LOOP;
    
    polygon_text := polygon_text || '))';
    
    -- Create geometry with SRID 20137
    BEGIN
        result_geom := ST_GeomFromText(polygon_text, 20137);
        
        -- Validate the geometry
        IF NOT ST_IsValid(result_geom) THEN
            -- Try to make it valid
            result_geom := ST_MakeValid(result_geom);
            
            -- Check again
            IF NOT ST_IsValid(result_geom) THEN
                RETURN NULL;
            END IF;
        END IF;
        
        RETURN result_geom;
    EXCEPTION WHEN OTHERS THEN
        RETURN NULL;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to sync geo -> geom
CREATE OR REPLACE FUNCTION sync_geo_to_geom()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process if geo field is being inserted or updated
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.geo IS DISTINCT FROM NEW.geo) THEN
        -- Convert geo to geom
        NEW.geom := convert_esri_rings_to_polygon(NEW.geo);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync geo -> geom
CREATE TRIGGER plots_geo_to_geom_trigger
    BEFORE INSERT OR UPDATE OF geo ON "public"."plots"
    FOR EACH ROW
    EXECUTE FUNCTION sync_geo_to_geom();
