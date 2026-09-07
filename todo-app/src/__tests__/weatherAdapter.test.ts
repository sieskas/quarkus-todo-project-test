import { afterEach, expect, it, vi } from "vitest";
import { WeatherAdapter } from "../outcall/weather/WeatherAdapter";
import { OpenAPI } from "../api/generated";
const originalFetch = globalThis.fetch;
const originalBase = OpenAPI.BASE;
afterEach(() => { globalThis.fetch = originalFetch; OpenAPI.BASE = originalBase; });
it("calls our backend without exposing provider credentials", async () => {
    OpenAPI.BASE = "http://backend.test/";
    const data = { city: "Montreal", temp: 22, description: "clear", icon: "01d" };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => data });
    globalThis.fetch = fetchMock;
    expect(await new WeatherAdapter().getWeather({ name: "Montreal", lat: 45, lon: -73 })).toEqual(data);
    expect(fetchMock).toHaveBeenCalledWith("http://backend.test/api/v1/weather?lat=45&lon=-73");
});
it("propagates a backend failure to the UI", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 502 });
    await expect(new WeatherAdapter().getWeather({ name: "Montreal", lat: 45, lon: -73 })).rejects.toThrow("502");
});
