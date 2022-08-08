package com.taager.allocation.capacity.queries.infrastructure.db.access
import com.taager.allocation.capacity.queries.infrastructure.db.models.CountryDbo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
@Repository
interface CountryDao: JpaRepository<CountryDbo, String>