ALTER TABLE users
    DROP COLUMN IF EXISTS is_premium,
    DROP COLUMN IF EXISTS free_analysis_used,
    DROP COLUMN IF EXISTS free_analysis_limit;
