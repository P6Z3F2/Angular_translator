import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from 'src/app/models/language.model';
import { DictionaryService } from 'src/app/service/dictionary.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.css']
})
export class LanguagesComponent implements OnInit {
  lang: Language = { def: [{ text: "", pos: "", tr: [{ text: "", syn: [{ text: "" }] }] }] };
  name: string = "";
  word: string = "";
  from: string[] = [];
  to: string[] = [];
  selectedTo: string = "";
  selectedFrom: string = "";
  translated: boolean = false;
  sTo: string = "Szinonímák:";
  sToList: string[] = [];
  warning: boolean = false;
  warning2: boolean = false;
  warning3: boolean = false;

  constructor(private dictionaryService: DictionaryService) {
  }

  ngOnInit(): void {
    //Itt töltöm fel a bal oldali dropdown listet a kiinduló nyelvekkel a fordításhoz
    //Ellenőrzöm, hogy a local storage-ben léteznek-e már az adatok, mert ha igen akkor inkább onnan kérdezem le, nem pedig a vépgponttól.
    if (localStorage.getItem('languages')) {
      let Langs: string[] = [];
      Langs = JSON.parse(localStorage.getItem('languages') || '{}') as string[];
      var index = 0;
        for (let i = 0; i < Langs.length; i++) {
          let k = 0;
          for (let j = 0; j < Langs[i].length; j++) {
            if (Langs[i][j] === '-') {
              break;
            }
            k++;
          }
          var exist = false;
          for (let j = 0; j < this.from.length; j++) {
            if (this.from[j] === Langs[i].substring(0, k)) {
              exist = true;
            }
          }
          if (exist === false) {
            this.from[index] = Langs[i].substring(0, k);
            index++;
          }
        }
    }
    // Ha nem létezik benne, akkor lekérem az Apitól
    else {
      console.log(localStorage.getItem('languages'));
      let Langs: string[] = [];
      this.dictionaryService.getLangs().subscribe(langs => {
        console.log(langs)
        Langs = langs;
        var index = 0;
        for (let i = 0; i < Langs.length; i++) {
          let k = 0;
          for (let j = 0; j < Langs[i].length; j++) {
            if (Langs[i][j] === '-') {
              break;
            }
            k++;
          }
          var exist = false;
          for (let j = 0; j < this.from.length; j++) {
            if (this.from[j] === Langs[i].substring(0, k)) {
              exist = true;
            }
          }
          if (exist === false) {
            this.from[index] = Langs[i].substring(0, k);
            index++;
          }
        }
        localStorage.setItem('languages', JSON.stringify(Langs));
      }, error => console.log(error))
    }

  }

  /**
   * Ez a függvény végzi el a szófordításokat.
   * Itt ellenőrzi, hogy ki lett-e választva mindkettő nyelv, ki lett töltve a megadandó szónak a szövegmezője
   */
  translate() {
    this.sToList = [];
    this.warning = false;
    this.warning2 = false;
    this.warning3 = false;
    console.log(this.selectedFrom);
    console.log(this.selectedTo);
    if (this.selectedFrom !== "" && this.selectedTo !== "") {
      if (this.word != "") {
        this.dictionaryService.translate(this.word, this.selectedFrom + "-" + this.selectedTo).subscribe((word: Language) => {
          this.lang = word;
          if (this.lang.def.length !== 0) {
            console.log(this.lang.def[0].tr[0].text);
            this.name = this.lang.def[0].tr[0].text;
            var jindex = 0;
            for (let i = 0; i < word.def[0].tr.length; i++) {
              this.sToList[jindex] = word.def[0].tr[i].text;
              console.log(word.def[0].tr[i].text);
              jindex++;
              if (word.def[0].tr[i].syn !== undefined) {
                for (let j = 0; j < word.def[0].tr[i].syn.length; j++) {
                  this.sToList[jindex] = word.def[0].tr[i].syn[j].text;
                  jindex++;
                }
              }
            }

            this.translated = true;
          } else {
            this.name = "-";
            this.sToList = [];
            this.warning2 = true;
          }

        }, error => (console.log(error)))
      } else {
        this.warning3 = true;
      }
    } else {
      this.warning = true;
    }

  }

  /**
   * Ez a függvény feltölti a jobb oldali select listet a bal oldalon kiválasztott nyelv alapján.
   */
  getTo() {
    if (localStorage.getItem('languages')) {
      let Langs: string[] = [];
      Langs = JSON.parse(localStorage.getItem('languages') || '{}') as string[];
      this.to = [];
      let z = 0;
      for (let i = 0; i < Langs.length; i++) {
        let k = 0;
        for (let j = 0; j < Langs[i].length; j++) {
          if (Langs[i][j] === '-') {
            break;
          }
          k++;
        }
        console.log(this.selectedFrom);
        console.log(Langs[i].substring(0, k));
        if (Langs[i].substring(0, k) === this.selectedFrom) {
          this.to[z] = Langs[i].substring(k + 1, Langs[i].length);
          z++;
        }
      }
      console.log(this.to);
    }
  }

}
