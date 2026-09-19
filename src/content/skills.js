import { FaAws } from "react-icons/fa";
import { SiArgo, SiDocker, SiElasticsearch, SiFluentbit, SiGit, SiGithubactions, SiGrafana, SiIstio, SiJaeger, SiKibana, SiKubernetes, SiLinux, SiOpentelemetry, SiPrometheus, SiPython, SiTerraform } from "react-icons/si";
import { CloudCog, ServerCog, ShieldCheck, Workflow } from "lucide-react";

export const skillGroups = [
  {
    title: "Cloud and Infrastructure",
    icon: CloudCog,
    items: [
      { label: "AWS", icon: FaAws, color: "#ff9900" },
      { label: "Terraform", icon: SiTerraform, color: "#844fba" },
      { label: "Linux", icon: SiLinux, color: "#f5efe4" },
      { label: "Python", icon: SiPython, color: "#3776ab" },
    ],
  },
  {
    title: "Containers and Orchestration",
    icon: ServerCog,
    items: [
      { label: "Docker", icon: SiDocker, color: "#2496ed" },
      { label: "Kubernetes", icon: SiKubernetes, color: "#326ce5" },
      { label: "Istio Service Mesh", icon: SiIstio, color: "#466bb0" },
    ],
  },
  {
    title: "Delivery and Version Control",
    icon: Workflow,
    items: [
      { label: "Git", icon: SiGit, color: "#f05032" },
      { label: "GitHub Actions", icon: SiGithubactions, color: "#2088ff" },
      { label: "Argo CD", icon: SiArgo, color: "#ef7b4d" },
    ],
  },
  {
    title: "Observability",
    icon: ShieldCheck,
    items: [
      { label: "Prometheus", icon: SiPrometheus, color: "#e6522c" },
      { label: "Grafana", icon: SiGrafana, color: "#f46800" },
      { label: "Elasticsearch", icon: SiElasticsearch, color: "#00bfb3" },
      { label: "Fluent Bit", icon: SiFluentbit, color: "#49bda5" },
      { label: "Kibana", icon: SiKibana, color: "#e8478b" },
      { label: "Jaeger", icon: SiJaeger, color: "#66cfe3" },
      { label: "OpenTelemetry", icon: SiOpentelemetry, color: "#f5efe4" },
    ],
  },
];
