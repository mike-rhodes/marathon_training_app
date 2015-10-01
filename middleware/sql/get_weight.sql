SELECT 
	UNIX_TIMESTAMP(weight_date) AS weight_date,
	weight_morning,
	weight_evening
FROM 
	weight_tracker
