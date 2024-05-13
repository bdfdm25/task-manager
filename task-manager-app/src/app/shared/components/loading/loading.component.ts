import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="flex flex-col justify-center items-center gap-y-4">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"
      ></div>
      <span class="text-lg font-normal">loading data</span>
    </div>
  `,
})
export class LoadingComponent {}
