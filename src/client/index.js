// This file: index.js is the entry point for webpack
import { getInformation } from './js/app';
import './style/style.scss';
import { getLatLong } from './js/app';
import { getMaxMinTemp} from './js/app';
import { convertCToFTemp } from './js/app';
import { getImageURL } from './js/app';
import { postData } from './js/app';
import { createCards } from './js/app';
import { calculateDaysLeft } from './js/app';
import { updateUI } from './js/app';
import { calculateDaysAway } from './js/app';



export { getInformation, getLatLong, getMaxMinTemp, convertCToFTemp, getImageURL, postData, createCards, calculateDaysLeft, updateUI, calculateDaysAway }