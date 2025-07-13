ALTER TABLE cats DROP CONSTRAINT cats_status_check;

ALTER TABLE cats ADD CONSTRAINT cats_status_check 
CHECK (status IN (
    'alive', 
    'deceased', 
    'sold', 
    'reserved',
    'under_breeding_evaluation',
    'preliminarily_reserved'
));