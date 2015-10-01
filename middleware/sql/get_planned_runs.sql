SELECT 
	UNIX_TIMESTAMP(planned_run_date) AS planned_run_date,
	planned_run_distance
FROM planned_runs
