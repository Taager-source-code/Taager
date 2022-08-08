package com.taager.travolta.common.security.jwt.dto
import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
@JsonIgnoreProperties(ignoreUnknown = true)
data class JwtUser(@JsonProperty("_id") val id: String, val userRoles: List<JwtUserRole>?)
@JsonIgnoreProperties(ignoreUnknown = true)
data class JwtUserPrivilege(@JsonProperty("privilege") val name: String, val group: String)
@JsonIgnoreProperties(ignoreUnknown = true)
data class JwtUserRole(@JsonProperty("role") val name: String, val privileges: List<JwtUserPrivilege>?)