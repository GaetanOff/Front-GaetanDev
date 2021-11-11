import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-experience',
  template: `
    <section class="w-full mb-10">
      <h3 class="font-bold text-2xl md:text-4xl mb-3">
        Expériences
      </h3>
      <div>
      </div>
      <div>
        <div>
          <div class="flex flex-row mb-5">
            <div class="self-center flex h-3 w-3 mr-3 relative"><span
              class="relative inline h-3 w-3 rounded-full opacity-75 animate-ping bg-green-600 dark:bg-amber-400"></span>
              <span class="inline absolute rounded-full h-3 w-3 bg-green-600 dark:bg-amber-400"></span></div>
            <div class="leading-7">
              <p class="text-base leading-6">Octobre 2016 - Aujourd'hui</p>
              <h1 class="text-2xl font-bold">Free-lance</h1>
              <h2 class="text-xl">Développeur FullStack & DevOps</h2>
            </div>
          </div>
        </div>

        <div>
          <div class="flex flex-row mb-5">
            <div class="self-center flex h-3 w-3 mr-3 relative"><span
              class="relative inline h-3 w-3 rounded-full opacity-75 bg-gray-400"></span> <span
              class="inline absolute rounded-full h-3 w-3 bg-gray-500"></span></div>
            <div class="leading-7">
              <p class="text-base leading-6">Juin 2021</p>
              <h1 class="text-2xl font-bold">EspritGames</h1>
              <h2 class="text-xl">Administrateur systèmes</h2>
            </div>
          </div>
        </div>

        <div>
          <div class="flex flex-row mb-5">
            <div class="self-center flex h-3 w-3 mr-3 relative"><span
              class="relative inline h-3 w-3 rounded-full opacity-75 bg-gray-400"></span> <span
              class="inline absolute rounded-full h-3 w-3 bg-gray-500"></span></div>
            <div class="leading-7">
              <p class="text-base leading-6">Janvier 2019</p>
              <h1 class="text-2xl font-bold">Ubisoft</h1>
              <h2 class="text-xl">Stage: Architecte logiciel & DevOps</h2>
            </div>
          </div>
        </div>

      </div>
      <div>
        <div class="flex flex-row mb-5">
          <div class="self-center flex h-3 w-3 mr-3 relative"><span
            class="relative inline h-3 w-3 rounded-full opacity-75 bg-gray-400"></span> <span
            class="inline absolute rounded-full h-3 w-3 bg-gray-500"></span></div>
          <div class="leading-7">
            <p class="text-base leading-6">Janvier 2017 / Janvier 2018</p>
            <h1 class="text-2xl font-bold">Université de Montpellier</h1>
            <h2 class="text-xl">Stage: Architecte logiciel & DevOps</h2>
          </div>
        </div>
      </div>
    </section>
  `
})
export class ExperienceComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
