package com.taager.allocation.capacity.commands.application.models
data class AddZonePriorityRequest(
    val provinceId: String,
    val zoneId: String,
    val provincePriorityId: String,
    val capacity: Int?,
)