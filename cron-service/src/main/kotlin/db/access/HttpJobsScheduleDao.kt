package com.taager.cronservice.infrastructure.db.access
import com.taager.cronservice.infrastructure.db.models.HttpJobsScheduleDbo
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.stereotype.Repository
@Repository
interface HttpJobsScheduleDao : CoroutineCrudRepository<HttpJobsScheduleDbo, Long>