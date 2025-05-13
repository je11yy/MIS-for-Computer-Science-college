from asyncpg import Connection

async def fetch_one(conn: Connection, query: str, *args):
    result = await conn.fetch(query, *args)
    return result[0] if result else None

async def fetch_row(conn: Connection, query: str, *args):
    return await conn.fetchrow(query, *args)

async def call_proc(conn: Connection, proc: str, *args):
    await conn.fetch(f"CALL {proc};", *args)

async def fetch_all(conn: Connection, query: str, *args):
    return await conn.fetch(query, *args)