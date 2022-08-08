package com.taager.cronservice.infrastructure.sharedkernel.infrastructure.utils
import com.taager.cronservice.infrastructure.application.models.HttpJobsSchedule
import com.taager.cronservice.infrastructure.sharedkernel.infrastructure.application.config.CustomTaskScheduler
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.scheduling.TaskScheduler
import org.springframework.scheduling.support.CronTrigger
import org.springframework.stereotype.Component
@Component
class SchedulerUtils(private val threadPoolTaskScheduler: TaskScheduler) {
    private val logger: Logger = LoggerFactory.getLogger(this.javaClass)
    fun scheduling(task: Runnable, cronExpression: String) {
        // Schedule a task with the given cron expression
        threadPoolTaskScheduler.schedule(task, CronTrigger(cronExpression))
    }
    suspend fun cancelJobsDeletedInDB(jobsSchedulesFromDb: Set<HttpJobsSchedule>) {
        val taskScheduler = threadPoolTaskScheduler as CustomTaskScheduler
        val jobNames: Set<String> = jobsSchedulesFromDb.map { it.name }.toSet()
        val excludedJobs: Set<String> = taskScheduler.getTasks().toSet() - jobNames
        if (excludedJobs.isNotEmpty()) {
            logger.info("tasks before deleting: {}", taskScheduler.getTasks())
            logger.info("deleting jobs: {}", excludedJobs)
            excludedJobs.forEach { taskScheduler.cancelJob(it) }
            logger.info("tasks after deleting: {}", taskScheduler.getTasks())
        }
    }
}