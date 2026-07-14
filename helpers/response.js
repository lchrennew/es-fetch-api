

export const asJSON = response => response.json()

export const asText = response => response.text()

const handleLine = async (line, onEvent) => {
    if (!line.trim()) return
    const payload = JSON.parse(line)
    await onEvent?.(payload)
}

export const asEvents = async (response, onEvent) => {
    const body = response.body
    if (!body) return response
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    try {
        while (true) {
            const { done, value } = await reader.read()
            buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })
            const lines = buffer.split(/\r?\n/)
            buffer = lines.pop() ?? ''
            for (const line of lines) await handleLine(line, onEvent)
            if (done) break
        }
        await handleLine(buffer, onEvent)
    } finally {
        reader.releaseLock?.()
    }
    return response
}
