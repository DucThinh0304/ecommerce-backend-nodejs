'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
    ACCEPTED: 'Accepted',
    NO_CONTENT: 'No Content',
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message;
        this.status = statusCode;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }
}

class ACCEPTED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.ACCEPTED, reasonStatusCode = ReasonStatusCode.ACCEPTED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }
}

class NO_CONTENT extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.NO_CONTENT, reasonStatusCode = ReasonStatusCode.NO_CONTENT, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata });
    }
}

module.exports = {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    SuccessResponse
}