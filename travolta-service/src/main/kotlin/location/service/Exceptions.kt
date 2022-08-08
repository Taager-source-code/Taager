package com.taager.travolta.location.service
class LocationNotFoundException(message: String, val locationId: String, val warehouseCode: String? = null)
    : RuntimeException(message)
class InsufficientQuantityOnLocationException(message: String, val locationId: String,
      val locationQuantity: Int, val requiredQuantity: Int): RuntimeException(message)
class InsufficientQuantityInPickList(message: String, val pickerId: String, val locationId: String,
      val variantId: String): RuntimeException(message)