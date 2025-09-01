-- Backfill script to populate geom column for existing plot data
-- This script converts existing geo JSON data to PostGIS geometry

-- First, let's see how many plots we have and their current state
SELECT 
    COUNT(*) as total_plots,
    COUNT(geo) as plots_with_geo,
    COUNT(geom) as plots_with_geom,
    COUNT(CASE WHEN geo IS NOT NULL AND geom IS NULL THEN 1 END) as plots_needing_backfill
FROM plots;

-- Update all plots that have geo data but no geom data
UPDATE plots 
SET geom = convert_esri_rings_to_polygon(geo)
WHERE geo IS NOT NULL 
  AND geom IS NULL
  AND geo ? 'geometry' 
  AND geo->'geometry' ? 'rings';

-- Check the results
SELECT 
    COUNT(*) as total_plots,
    COUNT(geo) as plots_with_geo,
    COUNT(geom) as plots_with_geom,
    COUNT(CASE WHEN geo IS NOT NULL AND geom IS NULL THEN 1 END) as plots_still_needing_backfill,
    COUNT(CASE WHEN geo IS NOT NULL AND geom IS NOT NULL THEN 1 END) as plots_successfully_converted
FROM plots;

-- Show some sample data to verify the conversion worked
SELECT 
    id,
    plot_id,
    ST_AsText(geom) as geom_wkt,
    ST_Area(geom) as area_square_meters,
    ST_Perimeter(geom) as perimeter_meters,
    ST_SRID(geom) as srid
FROM plots 
WHERE geom IS NOT NULL 
LIMIT 5;

-- Check for any invalid geometries
SELECT 
    id,
    plot_id,
    ST_IsValid(geom) as is_valid,
    ST_IsValidReason(geom) as validity_reason
FROM plots 
WHERE geom IS NOT NULL 
  AND NOT ST_IsValid(geom);

-- Summary statistics
SELECT 
    'Backfill Summary' as operation,
    COUNT(*) as total_plots,
    COUNT(geom) as plots_with_geom,
    ROUND(AVG(ST_Area(geom))::numeric, 2) as avg_area_sq_meters,
    ROUND(AVG(ST_Perimeter(geom))::numeric, 2) as avg_perimeter_meters,
    MIN(ST_Area(geom)) as min_area_sq_meters,
    MAX(ST_Area(geom)) as max_area_sq_meters
FROM plots 
WHERE geom IS NOT NULL;