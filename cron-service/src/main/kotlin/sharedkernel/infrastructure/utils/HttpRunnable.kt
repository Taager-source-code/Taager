package com.taager.cronservice.infrastructure.sharedkernel.infrastructure.utils
import com.taager.cronservice.infrastructure.application.models.HttpJobsSchedule
import com.taager.cronservice.infrastructure.sharedkernel.application.BaseScheduleService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout
class HttpRunnable(
    private val httpJobService: BaseScheduleService,
    val httpJobsSchedule: HttpJobsSchedule,
    private val timeout: Long
) : Runnable {
    override fun run() {
        CoroutineScope(Dispatchers.IO).launch {
            withTimeout(timeout) {
                httpJobService.executeHttp(httpJobsSchedule.url, httpJobsSchedule.authToken)
            }
        }
    }
}