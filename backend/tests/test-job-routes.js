import express from 'express';
import jobRoutes from '../src/modules/jobs/job.routes.js';

// Function to extract all routes from a router
const getRoutes = (router, basePath = "") => {
    const routes = [];

    router.stack.forEach((layer) => {
        if (layer.route) {
            // Route layer
            const path = basePath + layer.route.path;
            const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
            routes.push(`${methods} ${path}`);
        } else if (layer.name === "router" && layer.handle.stack) {
            // Nested router layer
            const nestedPath = basePath + (layer.regexp.source === "\\/?.*?" ? "" : layer.regexp.source);
            routes.push(...getRoutes(layer.handle, nestedPath));
        }
    });

    return routes;
};

console.log("🔍 JOB ROUTES REGISTERED");
console.log("=========================");

const routes = getRoutes(jobRoutes);
routes.sort().forEach(route => console.log(`✅ ${route}`));

console.log("\n📋 Total routes:", routes.length);