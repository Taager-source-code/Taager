package com.taager.travolta.auth.domain
data class HeartBeat(
    val id: String? = null,
    val userId: String,
    var updatedAt: Long? = null
)
