import {Component, OnInit} from '@angular/core';
import {I18nService} from "../../../../services/i18n/i18n.service";

@Component({
    selector: 'app-competences',
    templateUrl: '/competences.component.html',
    standalone: false
})
export class CompetencesComponent implements OnInit {
  competencesList: any = [
    {
      name: 'JVM',
      image: 'assets/img/comp/JVM.webp',
    },
    {
      name: 'TypeScript',
      image: 'assets/img/comp/TypeScript.webp',
    },
    {
      name: 'Angular',
      image: 'assets/img/comp/Angular.webp',
    },
    {
      name: 'Svelte',
      image: 'assets/img/comp/Svelte.webp',
    },
    {
      name: 'SASS',
      image: 'assets/img/comp/SASS.webp',
    },
    {
      name: 'Go',
      image: 'assets/img/comp/Go.webp',
    },
    {
      name: 'C',
      image: 'assets/img/comp/C.webp',
    },
    {
      name: 'C++',
      image: 'assets/img/comp/Cpp.webp',
    },
    {
      name: 'C#',
      image: 'assets/img/comp/CSharp.webp',
    },
    {
      name: 'Dart',
      image: 'assets/img/comp/Dart.webp',
    },
    {
      name: 'Flutter',
      image: 'assets/img/comp/Flutter.webp',
    },
    {
      name: 'NodeJS',
      image: 'assets/img/comp/NodeJS.webp',
    },
    {
      name: 'AWS',
      image: 'assets/img/comp/AWS.webp',
    },
    {
      name: 'GCP',
      image: 'assets/img/comp/GCP.webp',
    },
    {
      name: 'OVHCloud',
      image: 'assets/img/comp/OVHCloud.webp',
    },
    {
      name: 'Prometheus',
      image: 'assets/img/comp/Prometheus.webp',
    },
    {
      name: 'Grafana',
      image: 'assets/img/comp/Grafana.webp',
    },
    {
      name: 'Datadog',
      image: 'assets/img/comp/Datadog.webp',
    },
    {
      name: 'VMWare',
      image: 'assets/img/comp/VMWare.webp',
    },
    {
      name: 'Proxmox',
      image: 'assets/img/comp/Proxmox.webp',
    },
    {
      name: 'Unraid',
      image: 'assets/img/comp/Unraid.webp',
    },
    {
      name: 'Docker',
      image: 'assets/img/comp/Docker.webp',
    },
    {
      name: 'Containerd',
      image: 'assets/img/comp/Containerd.webp',
    },
    {
      name: 'Kubernetes',
      image: 'assets/img/comp/Kubernetes.webp',
    },
    {
      name: 'Terraform',
      image: 'assets/img/comp/Terraform.webp',
    },
    {
      name: 'Ansible',
      image: 'assets/img/comp/Ansible.webp',
    }
  ];

  constructor(public i18n: I18nService) {
  }

  ngOnInit(): void {
  }

}
