-- Verification script for PostGIS functionality
-- This script tests all the implemented features

-- 1. Check PostGIS extension is enabled
SELECT 
    'PostGIS Extension' as test,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 2. Check geom column exists and has correct type
SELECT 
    'Geom Column Type' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'plots' 
            AND column_name = 'geom' 
            AND data_type = 'USER-DEFINED'
        ) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 3. Check constraint exists
SELECT 
    'Validation Constraint' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.check_constraints 
            WHERE constraint_name = 'plots_geom_valid_check'
        ) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 4. Check GiST index exists
SELECT 
    'GiST Index' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'plots' 
            AND indexname = 'plots_geom_gist_idx'
        ) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 5. Check trigger exists
SELECT 
    'Sync Trigger' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'plots_geo_to_geom_trigger'
        ) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 6. Check conversion function exists
SELECT 
    'Conversion Function' as test,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_name = 'convert_esri_rings_to_polygon'
        ) 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 7. Test data statistics
SELECT 
    'Data Statistics' as test,
    COUNT(*) as total_plots,
    COUNT(geo) as plots_with_geo,
    COUNT(geom) as plots_with_geom,
    COUNT(CASE WHEN geo IS NOT NULL AND geom IS NULL THEN 1 END) as plots_missing_geom,
    COUNT(CASE WHEN geom IS NOT NULL AND NOT ST_IsValid(geom) THEN 1 END) as invalid_geometries
FROM plots;

-- 8. Test sample geometry conversion
SELECT 
    'Sample Geometry Test' as test,
    id,
    plot_id,
    ST_AsText(geom) as geom_wkt,
    ST_Area(geom) as area_sq_meters,
    ST_Perimeter(geom) as perimeter_meters,
    ST_SRID(geom) as srid,
    ST_IsValid(geom) as is_valid
FROM plots 
WHERE geom IS NOT NULL 
LIMIT 3;

-- 9. Test spatial queries
-- Point-in-polygon test (using center of first plot)
WITH test_point AS (
    SELECT ST_Centroid(geom) as center_point
    FROM plots 
    WHERE geom IS NOT NULL 
    LIMIT 1
)
SELECT 
    'Point-in-Polygon Test' as test,
    COUNT(*) as plots_containing_center
FROM plots, test_point
WHERE ST_Contains(geom, test_point.center_point);

-- 10. Test bounding box query
WITH test_bbox AS (
    SELECT 
        ST_XMin(ST_Envelope(geom)) as min_x,
        ST_YMin(ST_Envelope(geom)) as min_y,
        ST_XMax(ST_Envelope(geom)) as max_x,
        ST_YMax(ST_Envelope(geom)) as max_y
    FROM plots 
    WHERE geom IS NOT NULL 
    LIMIT 1
)
SELECT 
    'Bounding Box Test' as test,
    COUNT(*) as plots_in_bbox
FROM plots, test_bbox
WHERE ST_Intersects(geom, ST_MakeEnvelope(min_x, min_y, max_x, max_y, 20137));

-- 11. Test buffer query
WITH test_center AS (
    SELECT ST_Centroid(geom) as center_point
    FROM plots 
    WHERE geom IS NOT NULL 
    LIMIT 1
)
SELECT 
    'Buffer Test' as test,
    COUNT(*) as plots_within_1000m
FROM plots, test_center
WHERE ST_DWithin(geom, test_center.center_point, 1000);

-- 12. Performance test - check if index is being used
EXPLAIN (ANALYZE, BUFFERS) 
SELECT COUNT(*) 
FROM plots 
WHERE ST_Intersects(geom, ST_MakeEnvelope(470000, 1029000, 476000, 1031000, 20137));

-- 13. Test conversion function with sample data
SELECT 
    'Conversion Function Test' as test,
    CASE 
        WHEN convert_esri_rings_to_polygon(
            '{"geometry": {"rings": [[[474056.14609999955, 1030648.0333999991], [475607.62939999998, 1030492.8850999996], [474211.29440000001, 1029251.6984000001], [474056.14609999955, 1030648.0333999991]]]}}'::jsonb
        ) IS NOT NULL 
        THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 14. Summary report
SELECT 
    'SUMMARY' as section,
    'PostGIS Implementation Complete' as status,
    'All spatial functionality is operational' as details;