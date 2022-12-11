import { Injectable, HttpService } from '@nestjs/common';
import {
  REFRESHTOKEN,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_LOCATION,
  GOOGLE_REVIEWS_API_KEY,
} from '../../environment';
import FormData from 'form-data';
@Injectable()
export class GoogleService {
  constructor(private httpService: HttpService) {}
  async reviews() {
    const refreshToken = REFRESHTOKEN;
    const URL_FOR_ACCESS_TOKEN = 'https://www.googleapis.com/oauth2/v4/token';
    const form: any = new FormData();
    form.append('refresh_token', refreshToken);
    form.append('client_id', GOOGLE_CLIENT_ID);
    form.append('client_secret', GOOGLE_CLIENT_SECRET);
    form.append('grant_type', 'refresh_token');
    const accessTokenCheck = new Promise((resolve, reject) => {
      this.httpService
        .post(URL_FOR_ACCESS_TOKEN, form, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          },
        })
        .toPromise()
        .then((response: any) => {
          console.log(
            'response.data.access_token :',
            response.data.access_token,
          );
          resolve(response.data.access_token);
        });
    });
    return accessTokenCheck.then((accessToken) => {
      return this.getReviews(GOOGLE_LOCATION, accessToken);
    });
  }
  async getReviews(location, access_token) {
    return new Promise((resolve, reject) => {
      const URL =
        'https://mybusiness.googleapis.com/v4/' +
        location +
        '/reviews?access_token=' +
        access_token +
        '&pageSize=20';
      this.httpService
        .get(URL)
        .toPromise()
        .then((body: any) => {
          const reviews = body.data.reviews.filter(
            (review) =>
              (review.starRating === 'FIVE' || review.starRating === 'FOUR') &&
              review.hasOwnProperty('comment'),
          );
          resolve(reviews);
        });
    });
  }

  async findReviewByLocation(placeId) {
    const URL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_REVIEWS_API_KEY}`;
    console.log(URL);
    const fetchReviews = new Promise((resolve, reject) => {
      this.httpService
        .get(URL)
        .toPromise()
        .then((body: any) => {
          resolve({ response: body.data });
        });
    });
    return fetchReviews;
  }
}
