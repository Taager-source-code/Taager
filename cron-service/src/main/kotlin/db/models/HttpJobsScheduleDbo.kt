package com.taager.cronservice.infrastructure.db.models
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
@Table("HTTP_JOBS")
data class HttpJobsScheduleDbo(
    @Id @Column(value = "JOB_ID") val id: Long,
    @Column(value = "JOB_NAME")
    val name: String,
    @Column(value = "JOB_DESCRIPTION")
    val description: String,
    @Column(value = "JOB_URL")
    val url: String,
    @Column(value = "AUTH_TOKEN")
    val authToken: String,
    @Column(value = "SCHEDULE_TIME")
    val scheduledTime: String,
    @Column(value = "CREATED_BY")
    val createdBy: String,
    @Column(value = "CREATED_AT")
    val createdAt: LocalDateTime,
    @Column(value = "UPDATED_BY")
    val updatedBy: String,
    @Column(value = "UPDATED_AT")
    val updatedAt: LocalDateTime
)