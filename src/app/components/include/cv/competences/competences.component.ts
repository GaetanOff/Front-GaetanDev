import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-competences',
  templateUrl: '/competences.component.html'
})
export class CompetencesComponent implements OnInit {
  competencesList = [
    {
      name: 'JVM',
      image: 'assets/img/comp/JVM.png',
    },
    {
      name: 'TypeScript',
      image: 'assets/img/comp/TypeScript.png',
    },
    {
      name: 'Angular',
      image: 'assets/img/comp/Angular.png',
    },
    {
      name: 'SASS',
      image: 'assets/img/comp/SASS.png',
    },
    {
      name: 'Go',
      image: 'assets/img/comp/Go.png',
    },
    {
      name: 'C',
      image: 'assets/img/comp/C.png',
    },
    {
      name: 'C++',
      image: 'assets/img/comp/C++.png',
    },
    {
      name: 'C#',
      image: 'assets/img/comp/CSharp.png',
    },
    {
      name: 'Dart',
      image: 'assets/img/comp/Dart.png',
    },
    {
      name: 'Flutter',
      image: 'assets/img/comp/Flutter.png',
    },
    {
      name: 'NodeJS',
      image: 'assets/img/comp/NodeJS.png',
    },
    {
      name: 'AWS',
      image: 'assets/img/comp/AWS.png',
    },
    {
      name: 'GCP',
      image: 'assets/img/comp/GCP.png',
    },
    {
      name: 'OVHCloud',
      image: 'assets/img/comp/OVHCloud.png',
    },
    {
      name: 'Prometheus',
      image: 'assets/img/comp/Prometheus.png',
    },
    {
      name: 'Grafana',
      image: 'assets/img/comp/Grafana.png',
    },
    {
      name: 'Datadog',
      image: 'assets/img/comp/Datadog.png',
    },
    {
      name: 'VMWare',
      image: 'assets/img/comp/VMWare.png',
    },
    {
      name: 'Proxmox',
      image: 'assets/img/comp/Proxmox.png',
    },
    {
      name: 'Unraid',
      image: 'assets/img/comp/Unraid.png',
    },
    {
      name: 'Docker',
      image: 'assets/img/comp/Docker.png',
    },
    {
      name: 'Containerd',
      image: 'assets/img/comp/Containerd.png',
    },
    {
      name: 'Kubernetes',
      image: 'assets/img/comp/Kubernetes.png',
    },
    {
      name: 'Terraform',
      image: 'assets/img/comp/Terraform.png',
    },
    {
      name: 'Ansible',
      image: 'assets/img/comp/Ansible.png',
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
