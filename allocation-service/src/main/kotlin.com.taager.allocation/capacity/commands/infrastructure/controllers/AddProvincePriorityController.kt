package com.taager.allocation.capacity.commands.infrastructure.controllers
import com.taager.allocation.capacity.commands.application.models.AddProvincePriorityRequest
import com.taager.allocation.capacity.commands.application.usecases.AddProvincePriority
import com.taager.allocation.openapi.api.AddProvincePriorityApi
import com.taager.allocation.openapi.model.AddProvincePriorityDTO
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RestControllerAdvice
@RestController
class AddProvincePriorityController(private val addProvincePriority: AddProvincePriority) : AddProvincePriorityApi {
    override fun addProvincePriority(
        provinceId: String,
        addProvincePriorityDTO: AddProvincePriorityDTO
    ): ResponseEntity<Unit> {
        addProvincePriority.execute(
            AddProvincePriorityRequest(
                provinceId = provinceId,
                companyId = addProvincePriorityDTO.companyId,
                capacityMode = addProvincePriorityDTO.capacityMode.value,
                cutOffTime = addProvincePriorityDTO.cutOffTime,
                capacity = addProvincePriorityDTO.capacity
            )
        )
        return ResponseEntity(HttpStatus.CREATED)
    }
}
@RestControllerAdvice(basePackageClasses = [AddProvincePriorityController::class])
class AddProvincePriorityAdvice {}
