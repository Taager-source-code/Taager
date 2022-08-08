package com.taager.cronservice.infrastructure.application.models
import java.util.concurrent.ScheduledFuture
data class JobDefinition(val scheduledFuture: ScheduledFuture<*>, val jobSchedule: JobsSchedule)