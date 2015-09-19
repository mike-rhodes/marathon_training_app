SELECT 
	UNIX_TIMESTAMP(actual_run_date) AS actual_run_date,
	actual_run_distance,
    CONCAT(LPAD(actual_run_hours, 2, 0), ':', LPAD(actual_run_min, 2, 0), ':', LPAD(actual_run_sec, 2, 0)) as total_time,
    actual_run_temp,
    actual_run_feels_like,
    CONCAT(ROUND((actual_run_humidity * 100),0),'%') AS actual_run_humidity
FROM actual_runs