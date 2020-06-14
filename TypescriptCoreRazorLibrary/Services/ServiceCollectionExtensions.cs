﻿using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace TypescriptCoreRazorLibrary.Services
{
    public static class ServiceCollectionExtensions
    {
        public static void AddTypescriptCoreRazorLibrary(this IServiceCollection services)
        {
            services.ConfigureOptions(typeof(FileProviderConfigureOptions));
        }
    }

    internal class FileProviderConfigureOptions : IPostConfigureOptions<StaticFileOptions>
    {
        private readonly IWebHostEnvironment environment;

        public FileProviderConfigureOptions(IWebHostEnvironment environment)
        {
            this.environment = environment;
        }

        public void PostConfigure(string name, StaticFileOptions options)
        {
            // Basic initialization in case the options weren't initialized by any other component
            options.ContentTypeProvider = options.ContentTypeProvider ?? new FileExtensionContentTypeProvider();

            if (options.FileProvider == null && this.environment.WebRootFileProvider == null)
                throw new InvalidOperationException("Missing FileProvider.");

            options.FileProvider = options.FileProvider ?? this.environment.WebRootFileProvider;

            // Add our provider
            ManifestEmbeddedFileProvider filesProvider = new ManifestEmbeddedFileProvider(GetType().Assembly, "wwwroot");
            options.FileProvider = new CompositeFileProvider(options.FileProvider, filesProvider);
        }
    }
}
