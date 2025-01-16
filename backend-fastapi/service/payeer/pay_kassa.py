import aiohttp

session = aiohttp.ClientSession(base_url='https://payeer.com/ajax/api/api.php')

async def get_balance():
    ...