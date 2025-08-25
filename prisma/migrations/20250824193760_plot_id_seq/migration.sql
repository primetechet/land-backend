CREATE SEQUENCE plot_id_seq START 1000 INCREMENT 1;
CREATE OR REPLACE FUNCTION plot_id_function() RETURNS trigger AS $$
DECLARE
  branch_code TEXT;
BEGIN
  -- Fetch branch prefix directly using NEW.branch_id
  SELECT code INTO branch_code
  FROM branches
  WHERE id = NEW.branch_id;

  NEW.plot_id := branch_code || LPAD(nextval('plot_id_seq')::text, 9, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER plot_id_trigger
BEFORE INSERT ON plots
FOR EACH ROW
EXECUTE FUNCTION plot_id_function();