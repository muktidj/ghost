"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationUtil = void 0;
const paginationUtil = (page, limit) => {
    const take = Number(limit || 10);
    const currentPage = Number(page || 1) - 1;
    const offset = currentPage * take;
    return {
        take,
        offset,
        currentPage
    };
};
exports.paginationUtil = paginationUtil;
