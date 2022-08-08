package com.taager.allocation.capacity.commands.application.models
data class AddProvincePriorityRequest(
    val provinceId: String,
    val companyId: String,
    val capacityMode: String,
    val cutOffTime: String,
    val capacity: Int?,
)