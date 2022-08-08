package com.taager.travolta.auth.repository.dbo
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document
@Document(collection = "heartbeat")
data class HeartBeatDbo (
        @Id val id: String? = null,
        @Indexed(unique=true) val userId: String,
        @LastModifiedDate var updatedAt: Long? = null
        )