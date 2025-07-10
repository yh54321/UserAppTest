const retry = async (fn, retries = 3, delay = 100) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries) throw err;
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

export { retry }