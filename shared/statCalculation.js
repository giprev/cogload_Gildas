function statCalculation (trial) {
	// collect per-task event collections
	let hit_nback = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && (trial.task == "nback") && trial.hit === 1} ); 
	let miss_nback = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && (trial.task == "nback") && trial.miss === 1} ); 
	let falseAlarm_nback = jsPsych.data.get().filterCustom(function(trial){ return (trial.block === "main_hard" || trial.block === "main_easy") && (trial.task === "nback") && trial.false_alarm === 1} ); 
	let correctRejection_nback = jsPsych.data.get().filterCustom(function(trial){ return (trial.block === "main_hard" || trial.block === "main_easy") && (trial.task === "nback") && trial.correct_rejection === 1} ); 
	let trials_nback = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && trial.task == "nback" && trial.key_press !== null });

	let hit_nbackVisual = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && (trial.task == "nbackVisual") && trial.hit === 1} ); 
	let miss_nbackVisual = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && (trial.task == "nbackVisual") && trial.miss === 1} ); 
	let falseAlarm_nbackVisual = jsPsych.data.get().filterCustom(function(trial){ return (trial.block === "main_hard" || trial.block === "main_easy") && (trial.task == "nbackVisual") && trial.false_alarm === 1} ); 
	let correctRejection_nbackVisual = jsPsych.data.get().filterCustom(function(trial){ return (trial.block === "main_hard" || trial.block === "main_easy") && (trial.task == "nbackVisual") && trial.correct_rejection === 1} ); 
	let trials_nbackVisual = jsPsych.data.get().filterCustom(function(trial){ return (trial.block =="main_hard" || trial.block == "main_easy") && trial.task == "nbackVisual" && trial.key_press !== null });

	// helper to compute rates with 0.5 correction and safe RT stats
	function computeRates(hitCol, missCol, faCol, crCol) {
		let hitCount = hitCol.count();
		let missCount = missCol.count();
		let faCount = faCol.count();
		let crCount = crCol.count();

		let phit = 0.5; // default
		let pfa = 0.5;
		let denomSignal = hitCount + missCount;
		let denomNoise = faCount + crCount;

		if (denomSignal > 0) {
			if (hitCount === 0) {
				phit = 0.5 / denomSignal;
			} else if (hitCount === denomSignal) {
				phit = (hitCount - 0.5) / denomSignal;
			} else {
				phit = hitCount / denomSignal;
			}
		}

		if (denomNoise > 0) {
			if (faCount === 0) {
				pfa = 0.5 / denomNoise;
			} else if (faCount === denomNoise) {
				pfa = (faCount - 0.5) / denomNoise;
			} else {
				pfa = faCount / denomNoise;
			}
		}

		let normHit = NormSInv(phit);
		let normFa = NormSInv(pfa);
		let dprime = normHit - normFa;

		function safeRoundMean(col) {
			return col.count() > 0 ? Math.round(col.select('rt').mean()) : null;
		}
		function safeRoundMedian(col) {
			return col.count() > 0 ? Math.round(col.select('rt').median()) : null;
		}

		return {
			hitCount, missCount, faCount, crCount,
			phit, pfa, normHit, normFa, dprime,
			rt_mean: safeRoundMean(jsPsych.data.get().filterCustom(function(t){ return false;})), // placeholder not used
			safeRoundMean, safeRoundMedian
		};
	}

	// compute stats for nback
	let stats_nback = computeRates(hit_nback, miss_nback, falseAlarm_nback, correctRejection_nback);
	// compute stats for nbackVisual
	let stats_nbackVisual = computeRates(hit_nbackVisual, miss_nbackVisual, falseAlarm_nbackVisual, correctRejection_nbackVisual);

	// assign trial fields for nback
	trial.test_part = "debrief";
	trial.STAT_nr_hit_nback = stats_nback.hitCount;
	trial.STAT_nr_miss_nback = stats_nback.missCount;
	trial.STAT_nr_false_alarm_nback = stats_nback.faCount;
	trial.STAT_nr_correct_rejection_nback = stats_nback.crCount;
	trial.STAT_nr_response_nback = trials_nback.count();
	trial.STAT_nr_no_response_nback = jsPsych.data.get().filterCustom(function(t){ return ( (t.block == "main_hard" || t.block == "main_easy") && t.task == "nback" && t.key_press == null) }).count();
	trial.STAT_accuracy_nback = ((stats_nback.hitCount + stats_nback.crCount) / (trials_nback.count() || 1)) * 100;
	trial.STAT_rt_mean_nback = trials_nback.count() > 0 ? Math.round(trials_nback.select('rt').mean()) : null;
	trial.STAT_rt_median_nback = trials_nback.count() > 0 ? Math.round(trials_nback.select('rt').median()) : null;
	trial.STAT_hit_rt_mean_nback = hit_nback.count() > 0 ? Math.round(hit_nback.select('rt').mean()) : null;
	trial.STAT_hit_rt_median_nback = hit_nback.count() > 0 ? Math.round(hit_nback.select('rt').median()) : null;
	trial.STAT_false_alarm_rt_mean_nback = falseAlarm_nback.count() > 0 ? Math.round(falseAlarm_nback.select('rt').mean()) : null;
	trial.STAT_false_alarm_rt_median_nback = falseAlarm_nback.count() > 0 ? Math.round(falseAlarm_nback.select('rt').median()) : null;
	trial.STAT_correct_rejection_rt_mean_nback = correctRejection_nback.count() > 0 ? Math.round(correctRejection_nback.select('rt').mean()) : null;
	trial.STAT_correct_rejection_rt_median_nback = correctRejection_nback.count() > 0 ? Math.round(correctRejection_nback.select('rt').median()) : null;
	trial.STAT_miss_rt_mean_nback = miss_nback.count() > 0 ? Math.round(miss_nback.select('rt').mean()) : null;
	trial.STAT_miss_rt_median_nback = miss_nback.count() > 0 ? Math.round(miss_nback.select('rt').median()) : null;
	trial.STAT_dprime_nback = stats_nback.dprime;

	// assign trial fields for nbackVisual
	trial.STAT_nr_hit_nbackVisual = stats_nbackVisual.hitCount;
	trial.STAT_nr_miss_nbackVisual = stats_nbackVisual.missCount;
	trial.STAT_nr_false_alarm_nbackVisual = stats_nbackVisual.faCount;
	trial.STAT_nr_correct_rejection_nbackVisual = stats_nbackVisual.crCount;
	trial.STAT_nr_response_nbackVisual = trials_nbackVisual.count();
	trial.STAT_nr_no_response_nbackVisual = jsPsych.data.get().filterCustom(function(t){ return ( (t.block == "main_hard" || t.block == "main_easy") && t.task == "nbackVisual" && t.key_press == null) }).count();
	trial.STAT_accuracy_nbackVisual = ((stats_nbackVisual.hitCount + stats_nbackVisual.crCount) / (trials_nbackVisual.count() || 1)) * 100;
	trial.STAT_rt_mean_nbackVisual = trials_nbackVisual.count() > 0 ? Math.round(trials_nbackVisual.select('rt').mean()) : null;
	trial.STAT_rt_median_nbackVisual = trials_nbackVisual.count() > 0 ? Math.round(trials_nbackVisual.select('rt').median()) : null;
	trial.STAT_hit_rt_mean_nbackVisual = hit_nbackVisual.count() > 0 ? Math.round(hit_nbackVisual.select('rt').mean()) : null;
	trial.STAT_hit_rt_median_nbackVisual = hit_nbackVisual.count() > 0 ? Math.round(hit_nbackVisual.select('rt').median()) : null;
	trial.STAT_false_alarm_rt_mean_nbackVisual = falseAlarm_nbackVisual.count() > 0 ? Math.round(falseAlarm_nbackVisual.select('rt').mean()) : null;
	trial.STAT_false_alarm_rt_median_nbackVisual = falseAlarm_nbackVisual.count() > 0 ? Math.round(falseAlarm_nbackVisual.select('rt').median()) : null;
	trial.STAT_correct_rejection_rt_mean_nbackVisual = correctRejection_nbackVisual.count() > 0 ? Math.round(correctRejection_nbackVisual.select('rt').mean()) : null;
	trial.STAT_correct_rejection_rt_median_nbackVisual = correctRejection_nbackVisual.count() > 0 ? Math.round(correctRejection_nbackVisual.select('rt').median()) : null;
	trial.STAT_miss_rt_mean_nbackVisual = miss_nbackVisual.count() > 0 ? Math.round(miss_nbackVisual.select('rt').mean()) : null;
	trial.STAT_miss_rt_median_nbackVisual = miss_nbackVisual.count() > 0 ? Math.round(miss_nbackVisual.select('rt').median()) : null;
	trial.STAT_dprime_nbackVisual = stats_nbackVisual.dprime;

	// ...existing code...
}