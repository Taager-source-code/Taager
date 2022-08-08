package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.models.AddZonePriorityRequest
import com.taager.allocation.capacity.commands.application.usecases.AddZonePriority
import com.taager.allocation.openapi.api.AddZonePriorityApi
import com.taager.allocation.openapi.model.AddZonePriorityDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class AddZonePriorityController(private val addZonePriority: AddZonePriority) : AddZonePriorityApi {
    override fun addZonePriority(
        provinceId: String,
        zoneId: String,
        addZonePriorityDTO: AddZonePriorityDTO
    ): ResponseEntity<Unit> {
        addZonePriority.execute(
            AddZonePriorityRequest(
                provinceId = provinceId,
                zoneId = zoneId,
                provincePriorityId = addZonePriorityDTO.provincePriorityId,
                capacity = addZonePriorityDTO.capacity
            )
        )
        return ResponseEntity(HttpStatus.CREATED)
    }
}
@RestControllerAdvice(basePackageClasses = [AddZonePriorityController::class])
class AddZonePriorityControllerAdvice {}