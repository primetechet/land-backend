CREATE SEQUENCE property_id_seq START 1 INCREMENT 1;
CREATE OR REPLACE FUNCTION property_id_function() RETURNS trigger AS $$
DECLARE
  existing_plot_id TEXT;
BEGIN
  -- Fetch branch prefix directly using NEW.plot_id
  SELECT plot_id INTO existing_plot_id
  FROM plots
  WHERE id = NEW.plot_id;

  NEW.property_id := existing_plot_id ||  '-' || LPAD(nextval('property_id_seq')::text, 2, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_id_trigger
BEFORE INSERT ON plot_properties
FOR EACH ROW
EXECUTE FUNCTION property_id_function();