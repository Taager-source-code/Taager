package com.taager.allocation.capacity.queries.infrastructure.db.models
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
@Entity(name = "ProvinceQueryDbo")
@Table(name = "province")
class ProvinceDbo (
    @Id
    @Column(nullable = false, updatable = false)
    val id: UUID,
    @Column(length = 50, nullable = false)
    val name: String,
    @Column(name = "cutoff_time")
    val cutOffTime: String,
)