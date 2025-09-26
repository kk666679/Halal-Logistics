import { Controller, Get, Query } from "@nestjs/common";
import { OraclesService } from "./oracles.service";

@Controller("oracles")
export class OraclesController {
  constructor(private readonly oraclesService: OraclesService) {}

  @Get("price")
  async getPrice(@Query("symbol") symbol: string) {
    return this.oraclesService.getPriceData(symbol);
  }

  @Get("weather")
  async getWeather(@Query("location") location: string) {
    return this.oraclesService.getWeatherData(location);
  }

  @Get("government")
  async getGovernmentData(@Query("agency") agency: string) {
    return this.oraclesService.getGovernmentData(agency);
  }
}
