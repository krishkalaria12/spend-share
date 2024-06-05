interface ErrorData<T> {
    message: string;
    success: boolean;
    status: number;
    error?: T
}

export function createError<T>(message: string, status: number, success: boolean, error?: T): ErrorData<T> {
    return {
        message,
        success,
        status,
        error
    };
}

