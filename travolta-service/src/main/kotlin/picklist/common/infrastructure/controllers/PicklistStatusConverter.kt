package com.taager.travolta.picklist.common.infrastructure.controllers.converters
import com.taager.travolta.openapi.model.PicklistStatusDto
import com.taager.travolta.picklist.common.domain.models.PicklistStatus
fun picklistStatusDomainToDto(status: PicklistStatus): PicklistStatusDto =
    when (status) {
        PicklistStatus.UN_ASSIGNED -> PicklistStatusDto.unassigned
        PicklistStatus.ASSIGNED -> PicklistStatusDto.assigned
        PicklistStatus.IN_PROGRESS -> PicklistStatusDto.inProgress
        PicklistStatus.COMPLETED -> PicklistStatusDto.completed
    }