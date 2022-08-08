package com.taager.travolta.auth.domain
data class UserCredentials(val username: String, val password: String, val warehouseCode: String? = null)