package com.taager.cronservice.infrastructure.application.models
data class HttpJobsSchedule(
    override val name: String,
    val url: String,
    val authToken: String,
    val scheduledTime: String,
) : JobsSchedule
