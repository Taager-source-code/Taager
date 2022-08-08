package com.taager.cronservice.infrastructure.application.contracts
import com.taager.cronservice.infrastructure.application.models.HttpJobsSchedule
import kotlinx.coroutines.flow.Flow
interface HttpJobScheduleRepo {
    fun getAllJobs(): Flow<HttpJobsSchedule>
}