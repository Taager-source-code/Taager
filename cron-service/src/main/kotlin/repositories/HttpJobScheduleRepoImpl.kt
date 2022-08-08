package com.taager.cronservice.infrastructure.repositories
import com.taager.cronservice.infrastructure.application.contracts.HttpJobScheduleRepo
import com.taager.cronservice.infrastructure.application.models.HttpJobsSchedule
import com.taager.cronservice.infrastructure.db.access.HttpJobsScheduleDao
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import org.springframework.stereotype.Service
@Service
class HttpJobScheduleRepoImpl(private val httpJobsScheduleDao: HttpJobsScheduleDao) : HttpJobScheduleRepo {
    override fun getAllJobs(): Flow<HttpJobsSchedule> {
        return httpJobsScheduleDao.findAll()
            .map {
                HttpJobsSchedule(it.name, it.url, it.authToken, it.scheduledTime)
            }
    }
}