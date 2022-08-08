package com.taager.cronservice.infrastructure.application.config
import com.taager.cronservice.infrastructure.application.models.HttpJobsSchedule
import com.taager.cronservice.infrastructure.repositories.HttpJobScheduleRepoImpl
import com.taager.cronservice.infrastructure.services.JobService
import com.taager.cronservice.infrastructure.sharedkernel.infrastructure.utils.HttpRunnable
import com.taager.cronservice.infrastructure.sharedkernel.infrastructure.utils.SchedulerUtils
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.toSet
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
/**
 * This class mainly does the scheduling for the cron
 * job to run dynamically after reading the db table allocation_schedule
 * (com.taager.cronservice.db.AllocationScheduleConfig)
 * and schedules the single thread executor to execute
 * the scheduled function as per the configured value
 */
@Configuration
@EnableScheduling
class SchedulerConfig constructor(
    private val jobService: JobService,
    private val httpJobsScheduleRepo: HttpJobScheduleRepoImpl,
    private val schedulerUtils: SchedulerUtils,
    @Value("\${scheduler.timeout.threshold.millis}") private val timeoutThreshold: Long
) {
    /**
     * schedule allocation as a back off with timeoutThreshold millis,
     * so it means that any thread takes more than timeoutThreshold millis to execute
     * its terminated by the coroutine
     * This is a blocking code which runs blocking with
     * coroutines please don't introduce any heavy job here.
     *
     * TODO:: add pulsar job scheduling as well
     */
    @Scheduled(fixedRateString = "\${scheduler.job.checker.millis}")
    fun scheduleJobs() {
        runBlocking {
            val setOfJobsInDb: Set<HttpJobsSchedule> = runAndReturnHttpJobsFromDb()
            schedulerUtils.cancelJobsDeletedInDB(setOfJobsInDb)
        }
    }
    private suspend fun runAndReturnHttpJobsFromDb(): Set<HttpJobsSchedule> {
        return httpJobsScheduleRepo.getAllJobs()
            .onEach { jobsSchedule ->
                schedulerUtils.scheduling(
                    HttpRunnable(
                        jobService,
                        jobsSchedule,
                        timeoutThreshold
                    ), jobsSchedule.scheduledTime
                )
            }.toSet()
    }
}