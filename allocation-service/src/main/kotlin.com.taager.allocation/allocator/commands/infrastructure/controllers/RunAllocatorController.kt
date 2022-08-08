package com.taager.allocation.allocator.commands.infrastructure.controllers
import com.taager.allocation.allocator.commands.application.usecases.RunAllocator
import com.taager.allocation.openapi.api.RunAllocatorApi
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
@RestController
class RunAllocatorController(private val runAllocator: RunAllocator): RunAllocatorApi {
    override fun runAllocator(): ResponseEntity<Unit> {
        runAllocator.execute()
        return ResponseEntity(HttpStatus.OK)
    }
}