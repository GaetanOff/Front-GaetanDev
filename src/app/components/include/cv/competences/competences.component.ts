import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { I18nService } from "../../../../services/i18n/i18n.service";

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencesComponent {
  public i18n = inject(I18nService);

  competencesList: { name: string, image: string }[] = [
    { name: 'Java', image: 'assets/img/comp/JVM.webp' },
    { name: 'C#', image: 'assets/img/comp/CSharp.webp' },
    { name: 'Go', image: 'assets/img/comp/Go.webp' },
    { name: 'Dart', image: 'assets/img/comp/Dart.webp' },
    { name: 'Python', image: 'assets/img/comp/Python.webp' },
    { name: 'TypeScript', image: 'assets/img/comp/TypeScript.webp' },
    { name: 'n8n', image: 'assets/img/comp/n8n.webp' },
    { name: 'TensorFlow', image: 'assets/img/comp/tensorflow.webp' },
    { name: 'OpenAI API', image: 'assets/img/comp/openai.webp' },
    { name: 'Hugging Face', image: 'assets/img/comp/huggingface.webp' },
    { name: 'Apache Spark', image: 'assets/img/comp/apache-spark.webp' },
    { name: 'Apache Airflow', image: 'assets/img/comp/apache-airflow.webp' },
    { name: 'MongoDB', image: 'assets/img/comp/mongodb.webp' },
    { name: 'AWS', image: 'assets/img/comp/AWS.webp' },
    { name: 'OVHCloud', image: 'assets/img/comp/OVHCloud.webp' },
    { name: 'Prometheus', image: 'assets/img/comp/Prometheus.webp' },
    { name: 'Grafana', image: 'assets/img/comp/Grafana.webp' },
    { name: 'Datadog', image: 'assets/img/comp/Datadog.webp' },
    { name: 'Proxmox', image: 'assets/img/comp/Proxmox.webp' },
    { name: 'Docker', image: 'assets/img/comp/Docker.webp' },
    { name: 'Kubernetes', image: 'assets/img/comp/Kubernetes.webp' },
    { name: 'Terraform', image: 'assets/img/comp/Terraform.webp' },
    { name: 'Ansible', image: 'assets/img/comp/Ansible.webp' },
  ];
}
