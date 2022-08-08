package com.taager.allocation.capacity.queries.infrastructure.db.models
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
@Entity(name = CountryQueryDbo)
@Table(name = country)
class CountryDbo(
    @Id
    @Column(name = iso_code3, length = 3)
    val isoCode3 String,
    @Column(length = 20)
    val name String,
    @Column(name = iso_code2, length = 3)
    val isoCode2 String
    )