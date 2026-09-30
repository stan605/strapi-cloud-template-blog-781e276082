'use strict';

/**
 * reviewer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::reviewer.reviewer');
